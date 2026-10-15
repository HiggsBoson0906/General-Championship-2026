import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Trophy, Search, ArrowUpDown, ArrowUpRight, Info, Shield, RotateCcw, ArrowUp, ArrowDown, Star, X } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { calculateStandings } from '../data/rankings';

const field = 'w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-3 text-sm text-stone-100 focus-visible:outline-2 focus-visible:outline-amber-400';
type Sort = 'rank' | 'department' | 'overallPoints';

export const RankingsPage: React.FC = () => {
  const { data, scoringConfig } = useTournament();
  const [params, setParams] = useSearchParams();
  const update = (key: string, value: string, fallback: string) => setParams(previous => {
    const next = new URLSearchParams(previous);
    if (value === fallback) next.delete(key); else next.set(key, value);
    return next;
  }, { replace: true });
  const competition = params.get('competition') === 'samar' ? 'samar' : 'gc';
  const category = ['girls', 'boys'].includes(params.get('category') ?? '') ? params.get('category')! : 'overall';
  const search = params.get('search') ?? '';
  const sport = params.get('sport') ?? 'all';
  const department = params.get('department') ?? 'all';
  const season = params.get('year') ?? 'all';
  const sort: Sort = params.get('sort') === 'rank' ? 'rank' : params.get('sort') === 'department' ? 'department' : 'overallPoints';
  const ascending = params.get('direction') === 'asc';
  const setCompetition = (value: string) => setParams(previous => {
    const next = new URLSearchParams(previous);
    next.set('competition', value);
    next.delete('department'); next.delete('search');
    return next;
  }, { replace: true });
  const setCategory = (value: string) => update('category', value, 'overall');
  const setSearch = (value: string) => update('search', value, '');
  const setSport = (value: string) => update('sport', value, 'all');
  const setDepartment = (value: string) => update('department', value, 'all');
  const setSeason = (value: string) => update('year', value, 'all');
  const [favorite, setFavorite] = useState(() => { try { return localStorage.getItem('shaurya-favorite-department') ?? ''; } catch { return ''; } });
  const toggleFavorite = (id: string) => {
    const next = favorite === id ? '' : id;
    setFavorite(next);
    try { if (next) localStorage.setItem('shaurya-favorite-department', next); else localStorage.removeItem('shaurya-favorite-department'); } catch { /* Pin remains available for this visit. */ }
  };
  const [filtersOpen, setFiltersOpen] = useState(false);
  const seasons = [...new Set((data?.matches ?? []).map(m => m.date.slice(0, 4)))].sort().reverse();
  const unavailable = competition === 'samar' || category !== 'overall';
  const standings = useMemo(() => calculateStandings(data?.teams ?? [], data?.sports ?? [],
    (data?.matches ?? []).filter(m => (sport === 'all' || m.sportId === sport) && (season === 'all' || m.date.startsWith(season))), scoringConfig), [data, sport, season, scoringConfig]);
  const rows = standings.filter(s => (department === 'all' || s.teamId === department) && `${s.department} ${s.teamName} ${s.shortName}`.toLowerCase().includes(search.toLowerCase().trim())).sort((a, b) => {
    const value = sort === 'department' ? a.department.localeCompare(b.department) : a[sort] - b[sort];
    return ascending ? value : -value;
  });
  const changeSort = (key: Sort) => setParams(previous => {
    const next = new URLSearchParams(previous);
    next.set('sort', key);
    next.set('direction', (sort === key ? !ascending : key !== 'overallPoints') ? 'asc' : 'desc');
    return next;
  }, { replace: true });
  const sortIcon = (key: Sort) => sort === key ? ascending ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUpDown className="h-3 w-3" />;
  const reset = () => setParams(previous => {
    const next = new URLSearchParams(previous);
    ['search', 'sport', 'department', 'year', 'category'].forEach(key => next.delete(key));
    return next;
  }, { replace: true });
  const activeFilters = [
    ...(search ? [{ key: 'search', label: search, clear: () => setSearch('') }] : []),
    ...(competition === 'gc' && department !== 'all' ? [{ key: 'department', label: data?.teams.find(t => t.id === department)?.department ?? department, clear: () => setDepartment('all') }] : []),
    ...(sport !== 'all' ? [{ key: 'sport', label: data?.sports.find(s => s.id === sport)?.title ?? sport, clear: () => setSport('all') }] : []),
    ...(season !== 'all' ? [{ key: 'year', label: season, clear: () => setSeason('all') }] : []),
    ...(category !== 'overall' ? [{ key: 'category', label: category === 'girls' ? 'Girls' : 'Boys', clear: () => setCategory('overall') }] : []),
  ];
  return <div className={`space-y-5 sm:space-y-6 ${competition === 'samar' ? 'border-t-2 border-cyan-400/50 pt-4' : ''}`}>
    <section className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-amber-300"><Trophy className="h-4 w-4 shrink-0" /> Shaurya / {competition === 'samar' ? 'Inter-college standings' : 'Department standings'}</p>
          <h1 className="font-russo text-2xl leading-tight text-white sm:text-4xl">{competition === 'samar' ? 'ONE ARENA.' : 'EVERY POINT.'}<br /><span className="text-amber-400">{competition === 'samar' ? 'COLLEGE GLORY.' : 'DEPARTMENT PRIDE.'}</span></h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300">{competition === 'samar' ? 'Follow your college or university and its pursuit of the Samar title.' : 'Follow your department and see how every sport shapes the championship.'}</p></div>
        <div className="flex shrink-0 rounded-xl border border-stone-700 bg-black/30 p-1" aria-label="Competition">{[['gc', 'General Championship'], ['samar', 'Samar']].map(([id, label]) => <button key={id} aria-pressed={competition === id} onClick={() => setCompetition(id)} className={`rounded-lg px-4 py-3 text-sm font-semibold ${competition === id ? 'bg-amber-400 text-stone-950' : 'text-stone-300 hover:bg-stone-800'}`}>{label}</button>)}</div>
      </div>
      <p className="relative mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-amber-200/80">CSV preview · Provisional standings · Category totals pending</p>
    </section>

    {!unavailable && <section aria-label="Leading departments" className="grid gap-2 sm:grid-cols-3 sm:gap-3">{standings.slice(0, 3).map((s, i) => <Link to={`/teams/${s.teamId}`} key={s.teamId} className={`group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-3 overflow-hidden rounded-2xl border bg-gradient-to-br p-4 sm:block transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${i === 0 ? 'border-amber-400/40 from-amber-400/15 to-stone-950' : i === 1 ? 'border-red-400/25 from-red-400/10 to-stone-950' : 'border-blue-400/25 from-blue-400/10 to-stone-950'}`}>
      <div className="flex items-center justify-between"><span className="rounded-lg border border-white/15 px-3 py-1 font-russo text-stone-200">#{s.rank}</span><Shield aria-hidden="true" className={`hidden h-9 w-9 sm:block ${i === 0 ? 'text-amber-300' : i === 1 ? 'text-red-300' : 'text-blue-300'}`} /></div>
      <h2 className="text-sm font-bold sm:mt-3 text-white group-hover:text-amber-300">{s.department}</h2><p className="mt-1 hidden text-xs text-stone-400 sm:block">{s.teamName}</p><div className="flex items-end justify-between sm:mt-3"><p className="font-russo text-2xl text-amber-300">{s.overallPoints}<span className="ml-2 font-sans text-xs text-stone-400">PTS</span></p><ArrowUpRight className="hidden h-5 w-5 text-stone-400 sm:block" /></div>
    </Link>)}</section>}

    <section className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5" aria-label="Standings filters">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="font-russo text-lg text-white">{competition === 'samar' ? 'Find your college / university' : 'Find your department'}</h2><button onClick={reset} className="flex items-center gap-1.5 px-2 py-2 text-xs text-amber-300"><RotateCcw className="h-3.5 w-3.5" />Reset</button></div>
      <div role="group" aria-label="Ranking category" className="mb-4 flex w-full sm:w-fit rounded-xl border border-stone-700 bg-black/30 p-1">
        {([['overall', 'Overall'], ['girls', 'Girls'], ['boys', 'Boys']] as const).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)} className={`flex-1 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-amber-300 ${category === id ? 'bg-amber-400 text-stone-950' : 'text-stone-300 hover:bg-stone-800'}`}>{label}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
        <label className="space-y-2 text-xs text-stone-300"><span>Search</span><div className="relative"><Search className="absolute right-3 top-3.5 h-4 w-4 text-stone-500" /><input className={`${field} pr-10`} value={search} onChange={e => setSearch(e.target.value)} placeholder={competition === 'samar' ? 'College or university' : 'Name or department'} /></div></label>
        <button type="button" aria-expanded={filtersOpen} aria-controls="ranking-extra-filters" onClick={() => setFiltersOpen(!filtersOpen)} className="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold text-amber-200 sm:hidden">{filtersOpen ? 'Hide filters' : 'Show filters'}{(department !== 'all' || sport !== 'all' || season !== 'all') && ' ? Active'}</button>
        <div id="ranking-extra-filters" className={`${filtersOpen ? 'grid' : 'hidden'} gap-4 sm:col-span-1 sm:grid sm:grid-cols-3 lg:col-span-3`}>
        {competition === 'samar' ? <label className="space-y-2 text-xs text-stone-300"><span>College / University</span><select className={`${field} disabled:cursor-not-allowed disabled:opacity-60`} defaultValue="all" disabled aria-describedby="college-data-note"><option value="all">All colleges / universities</option></select><span id="college-data-note" className="block text-stone-400">Awaiting college / university CSV data.</span></label> : <label className="space-y-2 text-xs text-stone-300"><span>Department</span><select className={field} value={department} onChange={e => setDepartment(e.target.value)}><option value="all">All departments</option>{data?.teams.map(t => <option key={t.id} value={t.id}>{t.department}</option>)}</select></label>}
        <label className="space-y-2 text-xs text-stone-300"><span>Sport</span><select className={field} value={sport} onChange={e => setSport(e.target.value)}><option value="all">All sports</option>{data?.sports.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
        <label className="space-y-2 text-xs text-stone-300"><span>Record year</span><select className={field} value={season} onChange={e => setSeason(e.target.value)}><option value="all">All available years</option>{seasons.map(y => <option key={y}>{y}</option>)}</select></label>
        </div>
      </div>
    </section>
    {activeFilters.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Active filters">{activeFilters.map(f => <button key={f.key} onClick={f.clear} aria-label={`Remove ${f.key} filter: ${f.label}`} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/5 px-3 text-xs text-amber-200"><span className="min-w-0 break-words">{f.label}</span><X className="h-3.5 w-3.5 shrink-0" /></button>)}</div>}
    {competition === 'gc' && favorite && data?.teams.some(t => t.id === favorite) && <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm"><Star className="h-4 w-4 fill-amber-300 text-amber-300" /><span className="min-w-0 flex-1 text-stone-200">{data.teams.find(t => t.id === favorite)?.department}</span><button className="min-h-11 px-3 text-amber-300" onClick={() => setDepartment(favorite)}>Show my department</button><button aria-label="Unpin department" className="min-h-11 px-3 text-stone-400" onClick={() => toggleFavorite(favorite)}><X className="h-4 w-4" /></button></div>}
    <section className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/40">
      <div className="flex items-center justify-between gap-4 border-b border-stone-800 p-5"><h2 className="font-russo text-lg text-white">{competition === 'gc' ? 'GC' : 'Samar'} points table</h2><span className="text-xs text-stone-400">{unavailable ? 'Awaiting data' : `${rows.length} departments`}</span></div>
      {unavailable ? <div role="status" className="px-6 py-16 text-center"><Shield className="mx-auto mb-4 h-10 w-10 text-stone-500" /><h3 className="text-lg font-bold text-white">{competition === 'samar' ? 'Samar standings are not available yet' : `${category === 'boys' ? 'Boys’' : 'Girls’'} points have not been supplied`}</h3><p className="mx-auto mt-2 max-w-md text-sm text-stone-400">These records need organiser-supplied data. Overall GC preview totals cannot be used as category or Samar results.</p></div> : <div className="max-h-[70vh] overflow-auto"><table className="w-full  text-left text-sm"><caption className="sr-only">Provisional department points. Category breakdowns are unavailable. Expand a department for sport contributions.</caption><thead className="sticky top-0 z-10 bg-stone-950 text-xs text-stone-400"><tr>{(['rank', 'department'] as const).map(key => <th key={key} scope="col" aria-sort={sort === key ? ascending ? 'ascending' : 'descending' : 'none'} className="px-3 py-4 sm:px-5"><button onClick={() => changeSort(key)} className={`flex min-h-11 items-center gap-2 capitalize ${sort === key ? 'text-amber-300' : ''}`}>{key}{sortIcon(key)}</button></th>)}<th scope="col" className="hidden p-4 text-right md:table-cell">Boys’ points</th><th scope="col" className="hidden p-4 text-right md:table-cell">Girls’ points</th><th scope="col" aria-sort={sort === 'overallPoints' ? ascending ? 'ascending' : 'descending' : 'none'} className="p-4"><button onClick={() => changeSort('overallPoints')} className={`ml-auto flex min-h-11 items-center gap-2 ${sort === 'overallPoints' ? 'text-amber-300' : 'text-stone-400'}`}>Overall points{sortIcon('overallPoints')}</button></th></tr></thead>
      <tbody className="divide-y divide-stone-800">{rows.map(s => <tr key={s.teamId} className={`align-top hover:bg-white/[0.02] ${favorite === s.teamId ? 'bg-amber-400/5' : ''}`}><td className="px-3 py-4 font-russo sm:px-5 text-amber-300">{s.rank}</td><td className="px-3 py-4 sm:px-5"><Link className="font-semibold text-white hover:text-amber-300" to={`/teams/${s.teamId}`}>{s.department} <span aria-hidden="true">↗</span></Link><div className="flex items-center justify-between gap-2"><p className="mt-1 text-xs text-stone-400">{s.teamName}</p><button onClick={() => toggleFavorite(s.teamId)} aria-label={`${favorite === s.teamId ? 'Unpin' : 'Pin'} ${s.department}`} aria-pressed={favorite === s.teamId} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-amber-300 hover:bg-amber-400/10"><Star className={`h-4 w-4 ${favorite === s.teamId ? 'fill-amber-300' : ''}`} /></button></div><details className="mt-3 text-xs text-stone-400"><summary className="cursor-pointer py-1 text-amber-200">Points breakdown</summary><p className="my-2 md:hidden">Boys: not supplied ? Girls: not supplied</p><ul className="mt-2 space-y-2">{s.distributedPoints.filter(b => sport === 'all' || b.sportId === sport).map(b => <li className="flex justify-between gap-6" key={b.sportId}><span>{b.sportTitle}</span><span>{b.points} pts</span></li>)}</ul></details></td><td className="hidden p-5 text-right text-stone-500 md:table-cell"><span aria-label="Not supplied">—</span></td><td className="hidden p-5 text-right text-stone-500 md:table-cell"><span aria-label="Not supplied">—</span></td><td className="px-3 py-4 text-right font-russo text-xl sm:p-5 text-amber-300">{s.overallPoints}</td></tr>)}{rows.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-stone-400">No departments match these filters.<button onClick={reset} className="mx-auto mt-3 block min-h-11 rounded-lg border border-amber-400/30 px-4 text-amber-300">Clear filters</button></td></tr>}</tbody></table></div>}
    </section>
    <details className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-5 text-xs leading-relaxed text-stone-400"><summary className="min-h-6 cursor-pointer font-semibold text-amber-200"><Info aria-hidden="true" className="mr-2 inline h-4 w-4" />How points work</summary><div className="mt-3">{scoringConfig.notes} Equal totals share a provisional rank. Official tie rules and authorised result approval are pending. Record years are derived from match dates; official season labels are unavailable. A dash means not supplied, never zero.</div></details>
  </div>;
};
